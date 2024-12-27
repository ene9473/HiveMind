;; Problem Submission and Bounty Setting Contract

(define-data-var last-problem-id uint u0)

(define-map problems
  { problem-id: uint }
  {
    title: (string-ascii 64),
    description: (string-utf8 1024),
    bounty: uint,
    submitter: principal,
    status: (string-ascii 20)
  }
)

(define-public (submit-problem (title (string-ascii 64)) (description (string-utf8 1024)) (bounty uint))
  (let
    (
      (problem-id (+ (var-get last-problem-id) u1))
    )
    (map-set problems
      { problem-id: problem-id }
      {
        title: title,
        description: description,
        bounty: bounty,
        submitter: tx-sender,
        status: "open"
      }
    )
    (var-set last-problem-id problem-id)
    (ok problem-id)
  )
)

(define-public (update-bounty (problem-id uint) (new-bounty uint))
  (let
    (
      (problem (unwrap! (map-get? problems { problem-id: problem-id }) (err u404)))
    )
    (asserts! (is-eq (get submitter problem) tx-sender) (err u403))
    (ok (map-set problems
      { problem-id: problem-id }
      (merge problem { bounty: new-bounty })
    ))
  )
)

(define-read-only (get-problem (problem-id uint))
  (ok (map-get? problems { problem-id: problem-id }))
)

