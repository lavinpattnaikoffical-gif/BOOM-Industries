import { motion } from 'framer-motion';

export default function PageLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-night-deep via-night-base to-night-deep flex items-center justify-center">
      <motion.div className="flex flex-col items-center gap-8">
        {/* Animated logo */}
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="relative"
        >
          <div className="w-16 h-16 rounded-full border-2 border-transparent bg-gradient-to-r from-primary via-ember to-primary bg-[length:200%_auto] p-0.5">
            <div className="w-full h-full rounded-full bg-night-deep flex items-center justify-center">
              <span className="text-primary font-display font-bold text-xl">✨</span>
            </div>
          </div>
        </motion.div>

        {/* Loading text */}
        <div className="space-y-2 text-center">
          <p className="text-foreground font-display font-semibold">Loading</p>
          <div className="flex gap-1 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
                className="w-2 h-2 bg-primary rounded-full"
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
