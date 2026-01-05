import "./SuggestionDropdown.css";
import type { GitHubUser } from "../../types";

type Props = {
  suggestions: GitHubUser[];
  show: boolean;
  onSelect: (username: string) => void;
};

export function SuggestionDropdown({ suggestions, show, onSelect }: Props) {
  if (!show || suggestions.length === 0) return null;

  return (
    <ul className="suggestions">
      {suggestions.slice(0, 5).map((user: GitHubUser) => (
        <li
          key={user.login}
          onClick={() => {
            onSelect(user.login);
          }}
        >
          <img src={user.avatar_url} alt={user.login} className="avatar-xs" />
          {user.login}
        </li>
      ))}
    </ul>
  );
}
