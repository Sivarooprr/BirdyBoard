class HomeController < ApplicationController
  skip_before_action :authenticate_user!, :only => [:index]

  def index
    if user_signed_in?
      filtered = false
      if params[:filter] && params[:filter] == 'liked'
        filtered = true
        @notices = Notice.joins(:post_likes).where(post_likes: {:user_id => current_user.id},:published => true).order(published_at: :desc)
      elsif params[:filter] && params[:filter] == 'public'
        filtered = true
        @notices = Notice.where(:is_public => true, :published => true).order(published_at: :desc)
      elsif params[:filter] && params[:filter] == 'commented'
        filtered = true
        @notices = Notice.joins(:notice_comments).where(notice_comments: {:user_id => current_user.id}, :published => true).distinct(:notice).order(published_at: :desc)
      else
        @notices = Notice.where(:published => true).order(published_at: :desc)
      end
      @summary_data = {
        total_notices: Notice.where(:published => true).size,
        public_notices: Notice.where(:published => true, :is_public => true).size,
        liked_by_you: PostLike.where(:user_id => current_user.id).size,
        filtered: filtered
      }
    else
      @notices = Notice.where(:is_public => true, :published => true).order(published_at: :desc)
    end
  end

  def notice_action
    nObj = Notice.find_by(:id => params[:notice_id])
    if nObj
      if params[:n_action] == 'like'
        unless nObj.post_likes.where(:user_id => current_user.id).size > 0
          nObj.post_likes.create(:user_id => current_user.id)
        end
      end
      if params[:n_action] == 'unlike'
        unless nObj.post_likes.where(:user_id => current_user.id).size == 0
          PostLike.delete(nObj.post_likes.where(:user_id => current_user.id).first.id)
        end
      end
      if params[:n_action] == 'comment_create'
        if params[:comment_text] != ""
          nObj.notice_comments.create(:user_id => current_user.id, :comment => params[:comment_text])
        else
          render json: {msg: 'Comment cannot be empty'}, status: 400
        end
      end
      render json: {
        msg: 'Success',
        total_likes: nObj.post_likes.size,
        total_comments: nObj.notice_comments.size,
        commented_notices: NoticeComment.where(:user_id => current_user.id).select(:notice_id).distinct.size,
        liked_records: PostLike.where(:user_id => current_user.id).size
      }
    else
      render json: {msg: 'Notice not found'}, status: 400
    end
  end

  def notice_details
    @nObj = Notice.find_by(:id => params[:notice_id])
    if @nObj
    else
      flash[:error] = "No records found"
      redirect_to root_path
    end
  end
end
