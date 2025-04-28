export type Claim = {
  id: string;
  item_id: string;
  title: string;
  reason: string | null;
  created_at: string;
  user_id: string;
  organization_id: string;
  status: string;
  updated_at: Date;
  item: {
    id: string;
    name: string;
    description: string | null;
    quantity: number;
    updated_at: string;
    created_at: string;
    user_id: string;
    category_id: string;
    is_public: boolean;
    organization_id: string;
  };
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string;
    emailAddresses: {
      id: string;
      emailAddress: string;
    }[];
  };
  itemAuthor: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    imageUrl: string;
    emailAddresses: {
      id: string;
      emailAddress: string;
    }[];
  };
};
