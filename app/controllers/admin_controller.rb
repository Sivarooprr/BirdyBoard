class AdminController < ApplicationController
  before_action :check_user_is_admin

  def list_users
  end

  def list_notices
  end

  def new_notice
    if request.post?
      nn = Notice.new(notice_params)
      if nn.published
        nn.published_at = DateTime.now
      end
      unless nn.save
        flash[:error] = "Error while saving notice record"
      end
      flash[:success] = "Notice created successfully"
      redirect_to list_notices_path
    end
  end

  def delete_notice
    n_obj = Notice.find_by(:id => params[:notice_id])
    if n_obj
      unless n_obj.destroy
        render json: {msg: 'Record deletion failed'}, status: 500
      end
      render json: {msg: 'Record delted successfully'}
    else
      render json: {msg: 'Notice not found'}, status: 400
    end
  end

  def edit_notice
    @nObj = Notice.find_by(:id => params[:notice_id])
    if @nObj
      if request.post?
        if !@nObj.published? && notice_params[:published]
          @nObj.published_at = DateTime.now
        end
        unless @nObj.update(notice_params)
          flash[:error] = "Error while updating notice record"
        else
          flash[:success] = "Notice updated successfully"
          redirect_to edit_notice_path(@nObj)
        end
      end
    else
      flash[:error] = "Record not found"
      redirect_to list_notices_path
    end
  end

  def get_user_listing
    begin
      d_listing_columns = %w[id first_name last_name email department semester is_admin is_verified created_at updated_at].freeze
      users = User.datatable_filter(params['search']['value'], params['columns'])
      users = users.datatable_order(params['order']['0']['column'].to_i, params['order']['0']['dir'])
      users = users.select(d_listing_columns).page(params['start'].to_i + 1).per(params['length'])
      users_filtered = users.count
      render json: { data: users, draw: params['draw'].to_i, recordsTotal: User.count, recordsFiltered: users_filtered}
    rescue Exception => e
      puts "Exception while user listing - #{e.message}"
      render json: {err: e.message}, status: 500
    end
  end

  def get_notice_listing
    begin
      d_listing_columns = %w[id content published published_at is_public created_at updated_at].freeze
      notices = Notice.datatable_filter(params['search']['value'], params['columns'])
      notices = notices.datatable_order(params['order']['0']['column'].to_i, params['order']['0']['dir'])
      notices = notices.select(d_listing_columns).page(params['start'].to_i + 1).per(params['length'])
      notices_filtered = notices.count
      render json: { data: notices, draw: params['draw'].to_i, recordsTotal: Notice.count, recordsFiltered: notices_filtered}
    rescue Exception => e
      puts "Exception while notice listing - #{e.message}"
      render json: {err: e.message}, status: 500
    end
  end

  def update_user
    user = User.find_by(:id => params[:uId])
    if user
      case params[:act]
      when 'enable'
        user.is_verified = true
      when 'disable'
        user.is_verified = false
      else
        render json: {msg: 'Invalid action'}, status: 500
      end

      unless user.save
        render json: {msg: 'Update failed'}, status: 500
      end

      render json: {msg: 'User update successful'}
    else
      render json: {msg: 'User not found'}, status: 400
    end
  end

  private
  def check_user_is_admin
    unless current_user.is_admin?
      flash[:error] = "You are not authorized to perform this operation."
      redirect_to root_path
    end
  end

  def notice_params
    params.require(:notice).permit(:content, :published, :is_public)
  end
end
