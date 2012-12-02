class MainController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.json do
        intent = params[:get]
        url = params[:url]

        case intent

        when 'markup'
          logger.debug "==== url: #{url}"
          # dirty hack adding '/' because the DB url field is populated by using anchor.href
          # which automatically adds the '/'
          if Site.find_by_url(url+'/').nil?
            logger.debug "=== does NOT exist"
            markup_string = open(url).read
            if markup_string.encoding.name != 'UTF-8'
              markup_string.force_encoding('utf-8')
            end
            render :json => JSON.dump(markup_string)
          else
            render :json => JSON.dump('')
          end

        when 'dcolor'

          if Rails.env.development?
            Miro.options[:image_magick_path] = "c:/ImageMagick/convert"
          end

          color_array = Miro::DominantColors.new(url).to_rgba

          # by default miro returns 8 dominant colors sorted by percentage
          # we return the first one if all of them are equally opaque
          # otherwise we return the most opaque, ie having greatest alpha value
          chosen_color = color_array.sort_by { |k| -k[3] }[0]

          logger.debug "color array: #{color_array}"
          logger.debug "chosen color: #{chosen_color}"

          render :json => JSON.dump({
            'red'=>chosen_color[0],
            'green'=>chosen_color[1],
            'blue'=>chosen_color[2]
          })

        when 'imgsize'
          size = FastImage.size(url)
          logger.debug size
          render :json => JSON.dump({
            'width' => size[0],
            'height' => size[1]
          })

        end
      end
    end
  end

  def dashboard
  end
end
