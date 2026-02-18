import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function MainLayout() {
  const location = useLocation();

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
          
          <main className="motion-container" style={{ 
            flexGrow: 1, 
            padding: "24px", 
            display: "grid", 
            gridTemplateColumns: "100%",
            alignItems: "start",
            overflowX: "hidden"
          }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ 
                  gridArea: "1 / 1",
                  width: "100%" 
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
