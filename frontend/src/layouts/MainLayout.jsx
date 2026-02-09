import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

function MainLayout() {
  const location = useLocation();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (location.pathname !== displayLocation.pathname) {
      setIsExiting(true);
    }
  }, [location, displayLocation]);

  const pageVariants = {
    initial: { opacity: 0, y: 5 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.3, ease: "easeOut" } 
    },
    exit: { 
      opacity: 0, 
      y: -5, 
      transition: { duration: 0.2, ease: "easeIn" } 
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <div className="d-flex flex-grow-1">
          <Sidebar /> 
          
          
          <main style={{ 
            flexGrow: 1, 
            padding: "24px", 
            display: "grid", 
            gridTemplateColumns: "100%",
            alignItems: "start",
            overflowX: "hidden"
          }}>
            <AnimatePresence 
              mode="wait" 
              initial={false}
              onExitComplete={() => {
                setIsExiting(false);
                setDisplayLocation(location);
                window.scrollTo(0, 0);
              }}
            >
              <motion.div
                key={displayLocation.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ 
                  gridArea: "1 / 1", // Forces stacking
                  width: "100%" 
                }}
              >
                <Outlet context={{ location: displayLocation }} />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
}

export default MainLayout;