class SiteController < ApplicationController
  layout 'mobile'

  def create
    url = params[:url]
    @site = Site.new(
      url: url,
      logo_img: params[:logo],
      nav_menu: params[:menu],
      content: params[:content]
    )
    if @site.save
      head :ok
    else
      head :bad_request
    end
  end

  def show
    url = session[:current_url]
    logger.debug "===== url: #{url}"
    if url.nil?
      head :not_found
    else
      @site = Site.find_by_url(url+'/')
    end
  end
end
