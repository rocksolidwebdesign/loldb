require "pry"
require "json"
require "nokogiri"
require "open-uri"

def get_raw_abilities(text)
  text.to_enum(:scan, /{{Ability frame\|[a-zA-Z]\|?\n.*?^}}\n}}\n\n/m).map { Regexp.last_match }.map { |m| m[0] }
end

def get_ability_key_binding(text)
  matches = text.match(/{{Ability frame\|([a-zA-Z])\|?/)
  if matches
    matches[1]
  end
end

def process_ability_lines(input)
  Hash[input.sub(/^\|/, "").split("\n|").map { |line|
    var_matches = line.match(/^\s*(.*?)\s*=\s*(.*)\s*/m)
    if var_matches
      [var_matches[1], var_matches[2]]
    end
  }.select { |x| !x.nil? }]
end

def get_ability_main(text)
  tmatches = text.match(/{{Ability info\s*\n(^\|.*?)^}}$/m)
  if tmatches
    process_ability_lines(tmatches[1])
  end
end

def get_ability_other(text)
  tmatches = text.match(/{{Ability2\s*\n(^\|.*?)^}}$/m)
  if tmatches
    process_ability_lines(tmatches[1])
  end
end

def get_ability_scales(text)
  raw_scales = text.split("\n")
  raw_scales.map { |scale_text|
    {
      "scale_type" => get_ability_stat_affected(scale_text),
      "level_values" => get_ability_leveling(scale_text),
      "scaling" => get_ability_scaling(scale_text)
    }
  }
end

def get_ability_stat_affected(text)
  matches = text.match(/{{lc\|([^}]*)}}/)
  if matches
    matches[1]
  end
end

def get_ability_leveling(text)
  matches = text.match(/{{ap\|([^}]*)}}/)
  if matches
    matches[1].split("|").map(&:to_f)
  end
end

def get_ability_scaling(scale_text)
  scalars = scale_text.to_enum(:scan, /{{as\|\(\+ ([^}]*)\)}}/).map { Regexp.last_match }.map { |m| m[1] }
  scalars.map { |scalar_text|
    scale_vals = scale_text.split(" ")

    {
      "bonusOnly" => !!scale_text.match(/bonus/),
      "mulitplier" => scale_vals.first.gsub("%", "").to_f,
      "scales_on" => scale_vals.last
    }
  }
end

def process_champs(files)
  files.map { |relpath|
    filename = File.realpath(relpath)
    champ_name = filename.split("/").last.match(/(.*?)\.txt/)[1]
    contents = File.open(filename, "r") { |fh| fh.read }

    {
      "id" => champ_name,
      "abilities" => Hash[get_raw_abilities(contents).map { |text|
        key_name = get_ability_key_binding(text)

        ability_main = get_ability_main(text)
        ability_other = get_ability_other(text)

        if ability_main["cooldown"] && ability_main["cooldown"].match(/ap/)
          ability_main["cooldown"] = get_ability_leveling(ability_main["cooldown"])
        end

        if ability_main["range"]
          ability_main["range"] = ability_main["range"].to_f
        end

        if ability_main["leveling"]
          ability_main["stat_scalars"] = get_ability_scales(ability_main["leveling"])
        end

        if ability_other["additional"]
          ability_other["additional"] = ability_other["additional"].sub(/^\s*\*\s*/, "").split("* ").map{|s|s.sub(/\n$/, "")}
        end

        [key_name, (ability_main || {}).merge(ability_other || {})]
      }]
    }
  }
end

def save_champ_data
  files = Dir.glob("./db/webcache/*.txt")
  champs = process_champs(files)
  File.open("db/abilities.json", "w") { |fh| fh.write(champs.to_json) }
end

save_champ_data
