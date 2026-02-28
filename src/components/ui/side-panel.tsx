import React, { forwardRef, ReactNode } from "react"
import { AnimatePresence, motion, MotionConfig } from "framer-motion"
import useMeasure from "react-use-measure"

import { cn } from "@/lib/utils"

type PanelContainerProps = {
  panelOpen: boolean
  handlePanelOpen: () => void
  className?: string
  videoUrl?: string
  renderButton?: (handleToggle: () => void) => ReactNode
  children: ReactNode
}

const sectionVariants = {
  open: {
    width: "97%",
    transition: {
      duration: 0.3,
      ease: [0.42, 0, 0.58, 1] as const,
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
  closed: {
    transition: { duration: 0.2, ease: [0.42, 0, 0.58, 1] as const },
  },
}

const sharedTransition = { duration: 0.6, ease: [0.42, 0, 0.58, 1] as const }

export const SidePanel = forwardRef<HTMLDivElement, PanelContainerProps>(
  ({ panelOpen, handlePanelOpen, className, renderButton, children }) => {
    const [measureRef, bounds] = useMeasure()

    return (
      <>
        {/* Mobile: Icon button only */}
        <div className="md:hidden fixed bottom-6 right-6 z-50">
          <div className="flex items-center justify-center">
            {renderButton && renderButton(handlePanelOpen)}
          </div>
        </div>

        {/* Mobile: Drawer overlay */}
        {panelOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handlePanelOpen}
            className="md:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}

        {/* Mobile: Drawer panel */}
        <motion.div
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 max-h-[80vh] rounded-t-2xl overflow-hidden"
          animate={panelOpen ? { y: 0 } : { y: "100%" }}
          transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }}
        >
          <div className="bg-neutral-900 w-full h-full overflow-y-auto">
            <div ref={measureRef} className="p-4">
              <AnimatePresence mode="popLayout">
                <motion.div
                  exit={{ opacity: 0 }}
                  transition={{
                    ...sharedTransition,
                    duration: sharedTransition.duration / 2,
                  }}
                  key="form-mobile"
                >
                  {panelOpen && (
                    <motion.div
                      exit={{ opacity: 0 }}
                      transition={sharedTransition}
                    >
                      {children}
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Desktop: Side panel (unchanged) */}
        <div className="hidden md:block">
          <ResizablePanel>
            <motion.div
              className={cn(
                "bg-neutral-900 rounded-r-[44px] w-[260px]",
                className
              )}
              animate={panelOpen ? "open" : "closed"}
              variants={sectionVariants}
              transition={{ duration: 0.2, ease: [0.42, 0, 0.58, 1] as const }}
            >
              <motion.div
                animate={{ height: bounds.height > 0 ? bounds.height : 0.1 }}
                className="h-auto"
                transition={{ type: "spring", bounce: 0.02, duration: 0.65 }}
              >
                <div ref={measureRef}>
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      exit={{ opacity: 0 }}
                      transition={{
                        ...sharedTransition,
                        duration: sharedTransition.duration / 2,
                      }}
                      key="form"
                    >
                      <div
                        className={cn(
                          "flex items-center w-full justify-start pl-4 md:pl-4 py-1 md:py-3",
                          panelOpen ? "pr-3" : ""
                        )}
                      >
                        {renderButton && renderButton(handlePanelOpen)}
                      </div>

                      {panelOpen && (
                        <motion.div
                          exit={{ opacity: 0 }}
                          transition={sharedTransition}
                        >
                          {children}
                        </motion.div>
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            </motion.div>
          </ResizablePanel>
        </div>
      </>
    )
  }
)

SidePanel.displayName = "SidePanel"

export default SidePanel

type ResizablePanelProps = {
  children: React.ReactNode
}

const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  ({ children }, ref) => {
    const transition = {
      type: "tween" as const,
      ease: [0.42, 0, 0.58, 1] as const,
      duration: 0.4,
    }

    return (
      <MotionConfig transition={transition}>
        <div className="flex w-full flex-col items-start">
          <div className="mx-auto w-full">
            <div
              ref={ref}
              className={cn(
                children ? "rounded-r-none" : "rounded-sm",
                "relative overflow-hidden"
              )}
            >
              {children}
            </div>
          </div>
        </div>
      </MotionConfig>
    )
  }
)

ResizablePanel.displayName = "ResizablePanel"
