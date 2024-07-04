import React, { useState } from "react";
import Sidebar from "./sections/Sidebar";
import Main from "./sections/Main";

import { NAV_ITEMS } from "./constants/nav-items";

const App: React.FC = () => {
  const [activeNavIndex, setActiveNavIndex] = useState(0);

  return (
    <div className="flex h-screen">
      <Sidebar
        activeNavIndex={activeNavIndex}
        setActiveNavIndex={setActiveNavIndex}
        navItems={NAV_ITEMS}
      />

      <Main activeNavIndex={activeNavIndex} navItems={NAV_ITEMS} />
    </div>
  );
};

export default App;
