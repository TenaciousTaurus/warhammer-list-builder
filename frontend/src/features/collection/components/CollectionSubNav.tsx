import { NavLink } from 'react-router-dom';

export function CollectionSubNav() {
  return (
    <nav className="collection-subnav">
      <NavLink
        to="/collection"
        end
        className={({ isActive }) =>
          `collection-subnav__link${isActive ? ' collection-subnav__link--active' : ''}`
        }
      >
        Models
      </NavLink>
      <NavLink
        to="/collection/recipes"
        className={({ isActive }) =>
          `collection-subnav__link${isActive ? ' collection-subnav__link--active' : ''}`
        }
      >
        Recipes
      </NavLink>
      <NavLink
        to="/collection/paints"
        className={({ isActive }) =>
          `collection-subnav__link${isActive ? ' collection-subnav__link--active' : ''}`
        }
      >
        Paints
      </NavLink>
    </nav>
  );
}
