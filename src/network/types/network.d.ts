declare type NetworkResponse = {
  status: number;
  error?: string;
};

declare type NetworkAuthResponse = NetworkResponse & {
  authenticated: boolean;
  userId?: string;
};

declare type NetworkProjectInfo = NetworkResponse & {
  projectName?: string;
  company?: string;
};

