import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'problem-submission': {
      functions: {
        'submit-problem': vi.fn(),
        'update-bounty': vi.fn(),
        'get-problem': vi.fn(),
      },
    },
  },
  globals: {
    'tx-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  },
}

function callContract(contractName: string, functionName: string, args: any[]) {
  return mockClarity.contracts[contractName].functions[functionName](...args)
}

describe('Problem Submission Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('submit-problem', () => {
    it('should submit a new problem successfully', async () => {
      const title = 'Optimize AI Algorithm'
      const description = 'We need to optimize our AI algorithm for better performance'
      const bounty = 1000
      mockClarity.contracts['problem-submission'].functions['submit-problem'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('problem-submission', 'submit-problem', [title, description, bounty])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('update-bounty', () => {
    it('should update the bounty successfully', async () => {
      const problemId = 1
      const newBounty = 1500
      mockClarity.contracts['problem-submission'].functions['update-bounty'].mockReturnValue({ success: true })
      
      const result = await callContract('problem-submission', 'update-bounty', [problemId, newBounty])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if not the problem submitter', async () => {
      const problemId = 1
      const newBounty = 1500
      mockClarity.contracts['problem-submission'].functions['update-bounty'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('problem-submission', 'update-bounty', [problemId, newBounty])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('get-problem', () => {
    it('should return problem details', async () => {
      const problemId = 1
      const expectedProblem = {
        title: 'Optimize AI Algorithm',
        description: 'We need to optimize our AI algorithm for better performance',
        bounty: 1000,
        submitter: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        status: 'open'
      }
      mockClarity.contracts['problem-submission'].functions['get-problem'].mockReturnValue({ success: true, value: expectedProblem })
      
      const result = await callContract('problem-submission', 'get-problem', [problemId])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(expectedProblem)
    })
  })
})

