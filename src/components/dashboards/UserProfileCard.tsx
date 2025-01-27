import { useGetIdentity } from '@refinedev/core';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Progress } from '../ui/progress';
import { UserProfile } from '../../types/userTypes';

export const UserProfileCard = () => {
  const { data: identity } = useGetIdentity<UserProfile>();

  if (!identity) return null;

  const tierProgress = {
    free: 25,
    basic: 50,
    pro: 75,
    enterprise: 100
  }[identity.subscription_tier || 'free'];

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <img
              className="h-12 w-12 rounded-full"
              src={identity.avatar_url || '/placeholder.svg'}
              alt="User avatar"
            />
          </div>
          <div>
            <h3 className="text-lg font-medium">{identity.full_name}</h3>
            <p className="text-sm text-muted-foreground">
              {identity.subscription_tier ? `${identity.subscription_tier} tier` : 'Free tier'}
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium mb-2">Subscription Progress</h4>
          <Progress value={tierProgress} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">
            Upgrade to unlock more features
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{identity.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Member Since</p>
            <p className="font-medium">
              {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
