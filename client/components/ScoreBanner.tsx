import { User } from '../../shared/classes/User';
import { useMemo } from 'react';
import logo from '../src/assets/Logo.png';

type ScoreBannerProps = {
    users: User[];
}

const ScoreBanner = ({ users }: ScoreBannerProps) => {
  // Memoized sorted users
  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      if (a.role === "host") return 1; // push host to end
      if (b.role === "host") return -1;
      return 0;
    });
  }, [users]);

  return (
    <>
      <div className="w-full shadow-sm fixed top-0 left-0 z-50 bg-white border-b border-border/50 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          {sortedUsers.map((user, index) => (
            <div key={index} className="flex items-center gap-3 min-w-0">
              {/* Avatar */}
              {user.role === "host" ? (
                <img
                  src={logo}
                  alt="The House"
                  className="w-10 h-10 rounded-full flex-shrink-0"
                />
              ) : (
                <div className="relative inline-flex items-center justify-center w-10 h-10 bg-muted rounded-full flex-shrink-0 bg-gray-600">
                  <span className="text-sm font-medium text-muted-foreground">
                    {user.initials}
                  </span>
                </div>
              )}

              {/* Name and Score */}
              <div className="flex items-center gap-2 min-w-0">
                {/* First name - hidden on mobile */}
                <span className="hidden sm:inline text-sm text-foreground truncate text-black">
                  {user.role === "host" ? "The House" : user.firstName}
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