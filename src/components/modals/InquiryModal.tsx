import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, MapPin, Package, MessageSquare } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { inquiryFormSchema } from '@/utils/validators';
import { submitInquiry } from '@/api/inquiries';
import { useInquiryCart } from '@/contexts/InquiryContext';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function InquiryModal({ isOpen, onClose }: InquiryModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { items, clearCart, total } = useInquiryCart();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      city: '',
      requirement: 'Retail',
      items: items,
      message: '',
    },
  });

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      const result = await submitInquiry({
        ...data,
        items: items.length > 0 ? items : [],
      });

      toast({
        title: 'Success!',
        description: 'Your inquiry has been submitted. We\'ll contact you soon!',
        duration: 5000,
      });

      clearCart();
      form.reset();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to submit inquiry. Please try again.',
        variant: 'destructive',
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-night-deep/95 border border-primary/20 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-display font-bold">
                  <span className="glow-text-gold">Submit Your Inquiry</span>
                </DialogTitle>
              </DialogHeader>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6 mt-6"
                >
                  {/* Name Field */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80 font-body">
                          Your Name <span className="text-primary">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="John Doe"
                              className="bg-night-surface/50 border-primary/20 text-foreground focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-lg"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* Phone Field */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80 font-body flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          Phone Number <span className="text-primary">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="9876543210"
                            type="tel"
                            className="bg-night-surface/50 border-primary/20 text-foreground focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-lg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* City Field */}
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80 font-body flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          City (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Mumbai, Delhi, Bangalore..."
                            className="bg-night-surface/50 border-primary/20 text-foreground focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-lg"
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* Requirement Dropdown */}
                  <FormField
                    control={form.control}
                    name="requirement"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80 font-body">
                          Your Requirement <span className="text-primary">*</span>
                        </FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="bg-night-surface/50 border-primary/20 text-foreground focus:border-primary rounded-lg">
                              <SelectValue placeholder="Select requirement type" />
                            </SelectTrigger>
                            <SelectContent className="bg-night-surface border-primary/20">
                              <SelectItem value="Retail">Retail</SelectItem>
                              <SelectItem value="Bulk">Bulk Order</SelectItem>
                              <SelectItem value="Event">Event/Festival</SelectItem>
                              <SelectItem value="Corporate">Corporate</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage className="text-xs text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* Selected Products Summary */}
                  {items.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-primary/5 border border-primary/20 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Package className="w-4 h-4 text-primary" />
                        <p className="font-body text-sm font-semibold text-foreground">
                          Selected Products ({items.length})
                        </p>
                      </div>
                      <div className="space-y-2">
                        {items.map((item) => (
                          <div
                            key={item.productId}
                            className="flex justify-between items-center text-xs text-muted-foreground"
                          >
                            <span>{item.productName}</span>
                            <span className="text-primary font-semibold">
                              x{item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                      {total > 0 && (
                        <div className="mt-3 pt-3 border-t border-primary/10 flex justify-between">
                          <span className="font-semibold text-foreground">Estimated Value:</span>
                          <span className="text-primary font-bold">₹{total.toFixed(2)}</span>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Message Field */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground/80 font-body flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-primary" />
                          Additional Message (Optional)
                        </FormLabel>
                        <FormControl>
                          <textarea
                            placeholder="Tell us more about your requirements..."
                            className="w-full bg-night-surface/50 border border-primary/20 text-foreground focus:border-primary focus:ring-1 focus:ring-primary/50 rounded-lg px-3 py-2 text-sm resize-none"
                            rows={3}
                            {...field}
                            value={field.value || ''}
                          />
                        </FormControl>
                        <FormMessage className="text-xs text-red-400" />
                      </FormItem>
                    )}
                  />

                  {/* Buttons */}
                  <div className="flex gap-3 justify-end pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      disabled={isSubmitting}
                      className="border-primary/30 text-foreground hover:bg-primary/10"
                    >
                      Cancel
                    </Button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className="relative px-6 py-2 rounded-lg font-display font-semibold text-primary-foreground overflow-hidden transition-all duration-200 disabled:opacity-50"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary via-ember to-primary bg-[length:200%_100%] animate-shimmer" />
                      <span className="relative z-10 flex items-center gap-2">
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Inquiry'
                        )}
                      </span>
                    </motion.button>
                  </div>

                  {/* Trust Badge */}
                  <div className="text-center text-xs text-muted-foreground">
                    We respect your privacy. Your information will only be used to contact you about your inquiry.
                  </div>
                </form>
              </Form>
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
