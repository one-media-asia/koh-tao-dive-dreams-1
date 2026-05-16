// Shared compatibility hook for older Book Now buttons.

export function useBookNowModal() {
  const showBookNow = false;
  const setShowBookNow = (open: boolean) => {
    if (open) window.location.href = 'https://www.divinginasia.com/booking';
  };
  const BookNowModalComponent = null;
  return { showBookNow, setShowBookNow, BookNowModalComponent };
}
