class MainController < ApplicationController
  def index
    respond_to do |format|
      format.html
      format.json do
        intent = params[:get]
        url = params[:url]

        case intent

        when 'markup'
          markup_string = open(url).read
          if markup_string.encoding.name != 'UTF-8'
            markup_string.force_encoding('utf-8')
          end
          render :json => JSON.dump(markup_string)
        end
      end
    end
  end

  def dashboard
  end
end
