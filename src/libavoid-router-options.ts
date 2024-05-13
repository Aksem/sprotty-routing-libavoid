export enum RouteType {
  PolyLine = 1,
  Orthogonal = 2,
}

// equal to ConnDirFlag in libavoid
export enum Directions {
  None = 0,
  Up = 1,
  Down = 2,
  Left = 4,
  Right = 8,
  All = 15,
}

export interface LibavoidRouterOptions {
  routingType?: RouteType; // default: polyline

  // penalties
  //! @brief  This penalty is applied for each segment in the connector
  //!         path beyond the first.  This should always normally be set
  //!         when doing orthogonal routing to prevent step-like connector
  //!         paths.
  //!
  //! Defaults to 10.
  //!
  //! @note   This penalty must be set (i.e., be greater than zero) in
  //!         order for orthogonal connector nudging to be performed, since
  //!         this requires reasonable initial routes.
  segmentPenalty?: number;

  //! @brief  This penalty is applied in its full amount to tight acute
  //!         bends in the connector path.  A smaller portion of the penalty
  //!         is applied for slight bends, i.e., where the bend is close to
  //!         180 degrees.  This is useful for polyline routing where there
  //!         is some evidence that tighter corners are worse for
  //!         readability, but that slight bends might not be so bad,
  //!         especially when smoothed by curves.
  //!
  //! Defaults to 0.
  //!
  anglePenalty?: number;

  //! @brief  This penalty is applied whenever a connector path crosses
  //!         another connector path.  It takes shared paths into
  //!         consideration and the penalty is only applied if there
  //!         is an actual crossing.
  //!
  //! Defaults to 0.
  //!
  //! @note   This penalty is still experimental!  It is not recommended
  //!         for normal use.
  crossingPenalty?: number;

  //! @brief  This penalty is applied whenever a connector path crosses
  //!         a cluster boundary.
  //!
  //! Defaults to 4000.
  //!
  //! @note   This penalty is still experimental!  It is not recommended
  //!         for normal use.
  //! @note   This penalty is very slow.  You can override the method
  //!         Router::shouldContinueTransactionWithProgress() to check
  //!         progress and possibly cancel overly slow transactions.
  clusterCrossingPenalty?: number;

  //! @brief  This penalty is applied whenever a connector path shares
  //!         some segments with an immovable portion of an existing
  //!         connector route (such as the first or last segment of a
  //!         connector).
  //!
  //! Defaults to 0.
  //!
  //! @note   This penalty is still experimental!  It is not recommended
  //!         for normal use.
  fixedSharedPathPenalty?: number;

  //! @brief  This penalty is applied to port selection choice when the
  //!         other end of the connector being routed does not appear in
  //!         any of the 90 degree visibility cones centered on the
  //!         visibility directions for the port.
  //!
  //! Defaults to 0.
  //!
  //! @note   This penalty is still experimental!  It is not recommended
  //!         for normal use.
  //! @note   This penalty is very slow.  You can override the method
  //!         Router::shouldContinueTransactionWithProgress() to check
  //!         progress and possibly cancel overly slow transactions.
  portDirectionPenalty?: number;

  //! @brief This parameter defines the spacing distance that will be added
  //!        to the sides of each shape when determining obstacle sizes for
  //!        routing.  This controls how closely connectors pass shapes, and
  //!        can be used to prevent connectors overlapping with shape
  //!        boundaries.
  //!
  //! Defaults to 0.
  //!
  shapeBufferDistance?: number;

  //! @brief This parameter defines the spacing distance that will be used
  //!        for nudging apart overlapping corners and line segments of
  //!        connectors.
  //!
  //! Defaults to 4.
  //!
  idealNudgingDistance?: number;

  //! @brief  This penalty is applied whenever a connector path travels
  //!         in the direction opposite of the destination from the source
  //!         endpoint.  By default this penalty is set to zero.  This
  //!         shouldn't be needed in most cases but can be useful if you
  //!         use penalties such as ::crossingPenalty which cause connectors
  //!         to loop around obstacles.
  //!
  //! Defaults to 0.
  //!
  reverseDirectionPenalty?: number;

  // other options
  //! This option causes the final segments of connectors, which are
  //! attached to shapes, to be nudged apart.  Usually these segments
  //! are fixed, since they are considered to be attached to ports.
  //!
  //! Defaults to false.
  //!
  //! This option also causes routes running through the same checkpoint
  //! to be nudged apart.
  //!
  //! This option has no effect if ::nudgeSharedPathsWithCommonEndPoint is
  //! set to false,
  //!
  //! @note   This will allow routes to be nudged up to the bounds of shapes.
  //!
  nudgeOrthogonalSegmentsConnectedToShapes?: boolean;

  //! This option causes hyperedge routes to be locally improved fixing
  //! obviously bad paths.  As part of this process libavoid will
  //! effectively move junctions, setting new ideal positions which can be
  //! accessed via JunctionRef::recommendedPosition() for each junction.
  //!
  //! Defaults to true.
  //!
  //! This will not add or remove junctions, so will keep the hyperedge
  //! topology the same.  Better routes can be achieved by enabling the
  //! ::improveHyperedgeRoutesMovingAddingAndDeletingJunctions option.
  //!
  //! If initial sensible positions for junctions in hyperedges are not
  //! known you can register those hyperedges with the HyperedgeRerouter
  //! class for complete rerouting.
  //!
  //! @sa   improveHyperedgeRoutesMovingAddingAndDeletingJunctions
  //! @sa   Router::hyperedgeRerouter()
  //!
  improveHyperedgeRoutesMovingJunctions?: boolean;

  //! This option penalises and attempts to reroute orthogonal shared
  //! connector paths terminating at a common junction or shape
  //! connection pin.  When multiple connector paths enter or leave
  //! the same side of a junction (or shape pin), the router will
  //! attempt to reroute these to different sides of the junction or
  //! different shape pins.
  //!
  //! Defaults to false.
  //!
  //! This option depends on the ::fixedSharedPathPenalty penalty having
  //! been set.
  //!
  //! @sa     fixedSharedPathPenalty
  //! @note   This option is still experimental!  It is not recommended
  //!         for normal use.
  //!
  penaliseOrthogonalSharedPathsAtConnEnds?: boolean;

  //! This option can be used to control whether collinear line
  //! segments that touch just at their ends will be nudged apart.
  //! The overlap will usually be resolved in the other dimension,
  //! so this is not usually required.
  //!
  //! Defaults to false.
  //!
  nudgeOrthogonalTouchingColinearSegments?: boolean;

  //! This option can be used to control whether the router performs
  //! a preprocessing step before orthogonal nudging where is tries
  //! to unify segments and centre them in free space.  This
  //! generally results in better quality ordering and nudging.
  //!
  //! Defaults to true.
  //!
  //! You may wish to turn this off for large examples where it
  //! can be very slow and will make little difference.
  //!
  performUnifyingNudgingPreprocessingStep?: boolean;

  //! This option causes hyperedge routes to be locally improved fixing
  //! obviously bad paths.
  //!
  //! It can cause junctions and connectors to be added or removed from
  //! hyperedges.  To get details of these changes for each connector you can
  //! call Router::newAndDeletedObjectListsFromHyperedgeImprovement().
  //!
  //! As part of this process libavoid will effectively move junctions by
  //! setting new ideal positions for each remaining or added junction,
  //! which can be read from JunctionRef::recommendedPosition() for each
  //! junction.
  //!
  //! Defaults to false.
  //!
  //! If set, this option overrides the ::improveHyperedgeRoutesMovingJunctions
  //! option.
  //!
  //! If initial sensible positions for junctions in hyperedges are not
  //! known you can register those hyperedges with the HyperedgeRerouter
  //! class for complete rerouting.
  //!
  //! @sa   improveHyperedgeRoutesMovingJunctions
  //! @sa   Router::hyperedgeRerouter()
  //!
  improveHyperedgeRoutesMovingAddingAndDeletingJunctions?: boolean;

  //! This option determines whether intermediate segments of connectors that
  //! are attached to common endpoints will be nudged apart.  Usually these
  //! segments get nudged apart, but you may want to turn this off if you would
  //! prefer that entire shared paths terminating at a common end point should
  //! overlap.
  //!
  //! Defaults to true.
  //!
  nudgeSharedPathsWithCommonEndPoint?: boolean;

  //! ...
  //!
  //! Defaults to 20.
  //!
  minimalSegmentLengthForChildPosition?: number;
}

export const libavoidRouterKind = "libavoid";