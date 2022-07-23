import { SignInButton } from "../SignInButton/SignInButton";
import { ActiveLink } from "../ActiveLink";
import styles from "./styles.module.scss";
import { FiMenu } from "react-icons/fi";
import { useState } from "react";
import useMedia from "use-media";

export function Header() {
  const [menuMobileIsActive, setMenuMobileIsActive] = useState(false);
  const mobile = useMedia({ maxWidth: "760px" });

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="/images/logo.svg" alt="Logo do ig.news" />
        <nav>
          <ActiveLink activeClassName={styles.active} href="/">
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts">
            <a>Posts</a>
          </ActiveLink>
          <SignInButton />
        </nav>

        <nav className={styles.navMobile}>
          <button onClick={() => setMenuMobileIsActive(!menuMobileIsActive)}>
            <FiMenu />
          </button>
        </nav>
      </div>

      {menuMobileIsActive && mobile ? (
        <div className={styles.menuMobile}>
          <ActiveLink activeClassName={styles.active} href="/">
            <a onClick={() => setMenuMobileIsActive(false)}>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href="/posts">
            <a onClick={() => setMenuMobileIsActive(false)}>Posts</a>
          </ActiveLink>
          <SignInButton />
        </div>
      ) : null}
    </header>
  );
}
