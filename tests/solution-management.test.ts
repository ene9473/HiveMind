import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'solution-management': {
      functions: {
        'submit-solution': vi.fn(),
        'update-solution': vi.fn(),
        'get-solution': vi.fn(),
        'get-problem-solutions': vi.fn(),
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

describe('Solution Management Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('submit-solution', () => {
    it('should submit a new solution successfully', async () => {
      const problemId = 1
      const content = 'This is a proposed solution to the problem'
      mockClarity.contracts['solution-management'].functions['submit-solution'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('solution-management', 'submit-solution', [problemId, content])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('update-solution', () => {
    it('should update an existing solution successfully', async () => {
      const solutionId = 1
      const newContent = 'This is an updated solution to the problem'
      mockClarity.contracts['solution-management'].functions['update-solution'].mockReturnValue({ success: true })
      
      const result = await callContract('solution-management', 'update-solution', [solutionId, newContent])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail if not the original contributor', async () => {
      const solutionId = 1
      const newContent = 'This is an unauthorized update'
      mockClarity.contracts['solution-management'].functions['update-solution'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('solution-management', 'update-solution', [solutionId, newContent])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('get-solution', () => {
    it('should return solution details', async () => {
      const solutionId = 1
      const expectedSolution = {
        problem_id: 1,
        content: 'This is a proposed solution to the problem',
        version: 1,
        contributor: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        status: 'submitted'
      }
      mockClarity.contracts['solution-management'].functions['get-solution'].mockReturnValue({ success: true, value: expectedSolution })
      
      const result = await callContract('solution-management', 'get-solution', [solutionId])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(expectedSolution)
    })
  })
  
  describe('get-problem-solutions', () => {
    it('should return all solutions for a problem', async () => {
      const problemId = 1
      const expectedSolutions = {
        solution_ids: [1, 2, 3]
      }
      mockClarity.contracts['solution-management'].functions['get-problem-solutions'].mockReturnValue({ success: true, value: expectedSolutions })
      
      const result = await callContract('solution-management', 'get-problem-solutions', [problemId])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(expectedSolutions)
    })
  })
})

