require 'readingtime'
module TextFilter
  def readingtime(input)
    input.reading_time :format => :long
  end
end
Liquid::Template.register_filter(TextFilter)