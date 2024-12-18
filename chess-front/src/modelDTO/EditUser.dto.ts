export interface EditUserDTO {
  username?: string;
  old_password: string;
  new_password?: string;
  new_password_confirm?: string;
}
