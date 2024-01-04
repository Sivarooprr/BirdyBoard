require 'test_helper'

class AdminControllerTest < ActionDispatch::IntegrationTest
  test "should get list_users" do
    get admin_list_users_url
    assert_response :success
  end

end
