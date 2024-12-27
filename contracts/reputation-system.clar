;; Reputation System Contract

(define-map user-reputation
  { user: principal }
  { score: int }
)

(define-public (update-reputation (user principal) (points int))
  (let
    (
      (current-score (default-to { score: 0 } (map-get? user-reputation { user: user })))
    )
    (ok (map-set user-reputation
      { user: user }
      { score: (+ (get score current-score) points) }
    ))
  )
)

(define-read-only (get-reputation (user principal))
  (ok (default-to { score: 0 } (map-get? user-reputation { user: user })))
)

