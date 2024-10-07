const app = {
  timeline: {
    isPaused: false,
    circlePositions: [],
    circlePublisherIndices: [],
    currentIndex: 0,
    internval: undefined,
  },
  auction: {
    auctions: [],
  },
  joinInterestGroup: {
    joinings: [],
  },
  flow: {
    intervals: {},
  },
  utils: {},
  animated: {
    timelineVerticleLine: undefined,
    ssp: undefined
  },
  canDrawAuctionFlow: true,
  p: null,
}

export default app;