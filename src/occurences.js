
// Data structure for recording time ranges when a word was spoken,
// where overlapping ranges are merged into a since occurrence.
// Stored as a list of non-overlapping {start, end} objects, in ascending order of `start`

// returns true if this occurrence was already present/accounted for
export function insertFindingOccurrence(x, xs) {
  let overlapping = false;
  for (let i = xs.length - 1; i >= 0; i--) {
    if (xs[i].end < x.start) {
      // insert after xs[i]
      xs.splice(i + 1, 0, x);
      return overlapping;
    }
    if (x.end < xs[i].start) {
      // before xs[i]
      continue;
    }
    // overlapping - merge
    overlapping = true;
    x = { 
      start: Math.min(x.start, xs[i].start),
      end: Math.max(x.end, xs[i].end)
    };
    // remove xs[i]
    xs.splice(i, 1);
  }
  // insert at start
  xs.splice(0, 0, x);
  return overlapping;
}
