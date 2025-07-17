class StaticPagesController < ApplicationController
  def index
    render file: Rails.root.join('public', 'index.html')
  end

  def catch_all
    render file: Rails.root.join('public', 'index.html')
  end
end 