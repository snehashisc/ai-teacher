import { Subject } from '../types';

export const class6Math: Subject = {
  id: 'math-6',
  name: 'Mathematics',
  chapters: [
    {
      id: 'ch1-numbers',
      name: 'Knowing Our Numbers',
      description: 'Understanding large numbers, place value, and number operations',
      estimatedHours: 8,
      topics: [
        {
          id: 'comparing-numbers',
          name: 'Comparing Numbers',
          description: 'Learning to compare and order large numbers',
          difficulty: 'easy',
        },
        {
          id: 'place-value',
          name: 'Place Value',
          description: 'Understanding place value in large numbers',
          difficulty: 'easy',
        },
        {
          id: 'number-operations',
          name: 'Number Operations',
          description: 'Addition, subtraction with large numbers',
          difficulty: 'medium',
          prerequisites: ['place-value'],
        },
      ],
    },
    {
      id: 'ch2-whole-numbers',
      name: 'Whole Numbers',
      description: 'Properties and operations on whole numbers',
      estimatedHours: 10,
      topics: [
        {
          id: 'number-line',
          name: 'Number Line',
          description: 'Representing whole numbers on a number line',
          difficulty: 'easy',
        },
        {
          id: 'properties',
          name: 'Properties of Whole Numbers',
          description: 'Commutative, associative, and distributive properties',
          difficulty: 'medium',
        },
        {
          id: 'patterns',
          name: 'Number Patterns',
          description: 'Identifying and creating patterns',
          difficulty: 'medium',
        },
      ],
    },
    {
      id: 'ch3-integers',
      name: 'Playing with Numbers',
      description: 'Factors, multiples, divisibility rules',
      estimatedHours: 12,
      topics: [
        {
          id: 'factors-multiples',
          name: 'Factors and Multiples',
          description: 'Understanding factors and multiples of numbers',
          difficulty: 'medium',
        },
        {
          id: 'prime-composite',
          name: 'Prime and Composite Numbers',
          description: 'Identifying prime and composite numbers',
          difficulty: 'medium',
          prerequisites: ['factors-multiples'],
        },
        {
          id: 'divisibility',
          name: 'Divisibility Rules',
          description: 'Rules for divisibility by 2, 3, 5, 9, 10',
          difficulty: 'medium',
        },
        {
          id: 'hcf-lcm',
          name: 'HCF and LCM',
          description: 'Finding highest common factor and least common multiple',
          difficulty: 'hard',
          prerequisites: ['factors-multiples', 'prime-composite'],
        },
      ],
    },
    {
      id: 'ch4-fractions',
      name: 'Fractions',
      description: 'Understanding and operations with fractions',
      estimatedHours: 15,
      topics: [
        {
          id: 'basic-fractions',
          name: 'Introduction to Fractions',
          description: 'Understanding numerator, denominator, and types of fractions',
          difficulty: 'easy',
        },
        {
          id: 'equivalent-fractions',
          name: 'Equivalent Fractions',
          description: 'Finding and simplifying equivalent fractions',
          difficulty: 'medium',
          prerequisites: ['basic-fractions'],
        },
        {
          id: 'comparing-fractions',
          name: 'Comparing Fractions',
          description: 'Comparing fractions with same and different denominators',
          difficulty: 'medium',
          prerequisites: ['basic-fractions'],
        },
        {
          id: 'addition-fractions',
          name: 'Addition of Fractions',
          description: 'Adding fractions with same and different denominators',
          difficulty: 'hard',
          prerequisites: ['equivalent-fractions', 'comparing-fractions'],
        },
        {
          id: 'subtraction-fractions',
          name: 'Subtraction of Fractions',
          description: 'Subtracting fractions with same and different denominators',
          difficulty: 'hard',
          prerequisites: ['addition-fractions'],
        },
      ],
    },
    {
      id: 'ch5-decimals',
      name: 'Decimals',
      description: 'Understanding and working with decimal numbers',
      estimatedHours: 12,
      topics: [
        {
          id: 'decimal-intro',
          name: 'Introduction to Decimals',
          description: 'Understanding decimal notation and place value',
          difficulty: 'easy',
        },
        {
          id: 'decimal-operations',
          name: 'Operations with Decimals',
          description: 'Addition and subtraction of decimals',
          difficulty: 'medium',
          prerequisites: ['decimal-intro'],
        },
      ],
    },
  ],
};
