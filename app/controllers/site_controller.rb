class SiteController < ApplicationController
  layout 'mobile'

  def create
    url = params[:url]
    if Site.find_by_url(url).nil?
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
    else
      @site = Site.find_by_url(url)
    end

  end

  def show
    @site = Site.last
  end
end
