#Creating admin user

admin = User.create(
  first_name: 'Birdy',
  last_name: 'Admin',
  password: 'admin123',
  is_verified: true,
  is_admin: true,
  email: 'a@b.com',
  department: 'Management'
)
admin.skip_confirmation!
admin.save!