require 'pry'
require 'json'
require 'nokogiri'
require 'open-uri'

class LeagueScraper
  def initialize
    @host = "leagueoflegends.wikia.com"
    @base_url = "http://#{@host}"
    @urls = {
      champ_list: "#{@base_url}/wiki/List_of_champions"
    }
  end

  def run_champs
    html = open(@urls[:champ_list])
    doc = Nokogiri::HTML(html) { |c| c.noblanks }

    champ_links(doc).map do |champ_info|
      [champ_info[0], process_champ(champ_info[1])]
    end
  end

  def champ_links(doc)
    champ_table = doc.at_xpath('//*[@id="mw-content-text"]/table[2]')
    champ_rows = champ_table.search('tr td span span a')
    champ_rows.map { |row| [row.text, "#{row.attr('href')}?action=edit"] }
  end

  def process_champ(link_url)
    html = open("#{@base_url}#{link_url}")
    doc = Nokogiri::HTML(html) { |c| c.noblanks }

    puts "processing #{link_url}"

    doc.css('#wpTextbox1').text
  end
end

scraper = LeagueScraper.new
champ_stats = scraper.run_champs

champ_stats.each do |stat_config|
  name = stat_config[0].gsub(/[^0-9a-zA-Z]/, '')
  data = stat_config[1]

  filename = File.realpath("./db/webcache/")
  filename = "#{filename}/#{name}.txt"

  puts "saving '#{name}' stats to #{filename}"

  File.open(filename, "w") { |fh| fh.write(data) }
end
