;; Solution Management Contract

(define-data-var last-solution-id uint u0)

(define-map solutions
  { solution-id: uint }
  {
    problem-id: uint,
    content: (string-utf8 2048),
    version: uint,
    contributor: principal,
    status: (string-ascii 20)
  }
)

(define-map problem-solutions
  { problem-id: uint }
  { solution-ids: (list 100 uint) }
)

(define-public (submit-solution (problem-id uint) (content (string-utf8 2048)))
  (let
    (
      (solution-id (+ (var-get last-solution-id) u1))
      (existing-solutions (default-to { solution-ids: (list) } (map-get? problem-solutions { problem-id: problem-id })))
    )
    (map-set solutions
      { solution-id: solution-id }
      {
        problem-id: problem-id,
        content: content,
        version: u1,
        contributor: tx-sender,
        status: "submitted"
      }
    )
    (map-set problem-solutions
      { problem-id: problem-id }
      { solution-ids: (unwrap! (as-max-len? (append (get solution-ids existing-solutions) solution-id) u100) (err u401)) }
    )
    (var-set last-solution-id solution-id)
    (ok solution-id)
  )
)

(define-public (update-solution (solution-id uint) (new-content (string-utf8 2048)))
  (let
    (
      (solution (unwrap! (map-get? solutions { solution-id: solution-id }) (err u404)))
    )
    (asserts! (is-eq (get contributor solution) tx-sender) (err u403))
    (ok (map-set solutions
      { solution-id: solution-id }
      (merge solution {
        content: new-content,
        version: (+ (get version solution) u1)
      })
    ))
  )
)

(define-read-only (get-solution (solution-id uint))
  (ok (map-get? solutions { solution-id: solution-id }))
)

(define-read-only (get-problem-solutions (problem-id uint))
  (ok (map-get? problem-solutions { problem-id: problem-id }))
)

