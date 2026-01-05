import { useMutation, useQuery } from "@tanstack/react-query";
import type { GitHubUser } from "../../types";
import "./UserCard.css";
import { FaGithubAlt, FaUserMinus, FaUserPlus } from "react-icons/fa";
import {
  checkIfFollowingUser,
  followGithubUser,
  unfollowGithubUser,
} from "../../api/git-hub";

export function UserCard({ user }: { user: GitHubUser }) {
  const { data: isFollowing, refetch } = useQuery({
    queryKey: ["follow-status", user.login],
    queryFn: () => checkIfFollowingUser(user.login),
    enabled: !!user.login,
  });

  const followMutation = useMutation({
    mutationFn: () => followGithubUser(user.login),
    onSuccess: () => {
      console.log(`You are now following ${user.login}`);
      refetch();
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: () => unfollowGithubUser(user.login),
    onSuccess: () => {
      console.log(`You are no longer following ${user.login}`);
      refetch();
    },
    onError: (err) => {
      console.error(err.message);
    },
  });

  const handleFollow = () => {
    if (isFollowing) {
      unfollowMutation.mutate();
    } else {
      followMutation.mutate();
    }
  };

  return (
    <div className="user-card">
      <img src={user.avatar_url} alt={user.name} className="avatar" />
      <h2>{user.name || user.login}</h2>
      <div className="bio">{user.bio}</div>
      <div className="user-card-buttons">
        {!!import.meta.env.VITE_GITHUB_API_TOKEN && (
          <button
            onClick={handleFollow}
            className={`follow-btn ${isFollowing ? "following" : ""}`}
            disabled={followMutation.isPending || unfollowMutation.isPending}
          >
            {isFollowing ? (
              <>
                <FaUserMinus className="follow-icon" /> Following
              </>
            ) : (
              <>
                <FaUserPlus className="follow-icon" /> Follow User
              </>
            )}
          </button>
        )}

        <a
          href={user.html_url}
          className="profile-btn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaGithubAlt />
          View GitGub Profile
        </a>
      </div>
    </div>
  );
}
