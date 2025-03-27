export interface Staff {
  object: string;
  id: string;
  public_metadata: {};
  private_metadata: {};
  role: string;
  role_name: string;
  permissions: string[];
  created_at: number;
  updated_at: number;
  organization: {};
  public_user_data: {
    first_name: string;
    last_name: string;
    image_url: string;
    has_image: boolean;
    identifier: string;
    profile_image_url: string;
    user_id: string;
  };
}
