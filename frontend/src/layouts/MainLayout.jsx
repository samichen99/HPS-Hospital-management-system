import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function MainLayout() {
  const location = useLocation();

  const layoutContainerStyle = {
    backgroundColor: "transparent",
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
  };

  // Professional macOS-style transition: slight lift and fade
  const pageVariants = {
    initial: { 
      opacity: 0, 
      y: 8,
      filter: "blur(4px)" 
    },
    animate: { 
      opacity: 1, 
      y: 0,
      filter: "blur(0px)" 
    },
    exit: { 
      opacity: 0, 
      y: -8,
      filter: "blur(4px)" 
    }
  };

  return (
    <>
      <Navbar />
      <div style={layoutContainerStyle}>
        <div className="d-flex flex-grow-1">
          {/* Sidebar is static - it does not unmount or re-animate */}
          <Sidebar /> 

          <main className="flex-grow-1 p-4" style={{ overflowX: "hidden" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname} // This key triggers the animation on route change
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ 
                  duration: 0.3, 
                  ease: [0.23, 1, 0.32, 1] // Apple-style cubic bezier
                }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </>
  );
}

export default MainLayout;