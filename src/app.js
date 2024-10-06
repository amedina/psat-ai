const app = {
  timeline: {
    isPaused: false,
    circlePositions: [],
    circlePublisherIndices: [],
    currentIndex: 0,
    internval: undefined,
  },
  animated: {
    timelineVerticleLine: undefined,
    ssp: undefined
  },
  canDrawAuctionFlow: true,
  utils: {},
}

export default app;