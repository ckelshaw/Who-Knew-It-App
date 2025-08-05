import { User } from '../../shared/classes/User';

type ScoreBannerProps = {
    users: User[];
}

const ScoreBanner = ({ users }: ScoreBannerProps) => {

    return (
      <>
        <div className="w-full shadow-sm fixed top-0 left-0 z-50 bg-white border-b border-border/50 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {users.map((user, index) => (
              <div key={index} className="flex items-center gap-3 min-w-0">
                {/* Avatar */}
                <div className="relative inline-flex items-center justify-center w-10 h-10 bg-muted rounded-full flex-shrink-0 bg-gray-600">
                  <span className="text-sm font-medium text-muted-foreground">
                    {user.initials}
                  </span>
                </div>

                {/* Name and Score */}
                <div className="flex items-center gap-2 min-w-0">
                  {/* First name - hidden on mobile */}
                  <span className="hidden sm:inline text-sm text-foreground truncate text-black">
                    {user.firstName}
                  </span>

                  {/* Score */}
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-muted-foreground text-black">
                      Score:
                    </span>
                    <span className="text-sm font-medium text-foreground text-black">
                      {user.score}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
};

export default ScoreBanner;