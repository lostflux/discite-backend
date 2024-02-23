import UserAffinity from '../models/user_affinity_model'
import UserModel from '../models/user_model'

// import the list of strings from src\utils\affinityTruthTable and make it a truth table for the affinity topics
const fs = require('fs')

const fileContent = fs.readFileSync('src/utils/affinityTruthTable', 'utf8')
const affinitiesTruthTable = fileContent.split(/[\r\n]+/).map(line => parseInt(line.trim(), 10)).filter(Number.isInteger);

export const createUserAffinities = async (user, { affinities }) => {
  try {
    const existingUserAffinity = await UserAffinity.findOne({
      userId: user._id
    })
    if (existingUserAffinity) {
      throw new Error('User affinities already exists')
    }

    const userAffinity = new UserAffinity({
      userId: user._id,
      affinities: []
    })

    const newAffinities = []
    
    affinities.forEach((topic) => {
      if (!affinitiesTruthTable.includes(topic)) {
        throw new Error(`Invalid topic ID: ${topic}`)
      }
      newAffinities.push(topic);
    })

    userAffinity.affinities = newAffinities

    const savedUserAffinity = await userAffinity.save()
    return savedUserAffinity
  } catch (error) {
    throw new Error(`Create user affinities error: ${error}`)
  }
}

export const getUserAffinities = async (user) => {
  try {
    const userAffinities = await UserAffinity.findOne({ userId: user._id })
    return userAffinities
  } catch (error) {
    throw new Error(`Get user affinities error: ${error}`)
  }
}

export const updateUserAffinities = async (user, { affinities }) => {
  try {
    const userAffinity = await UserAffinity.findOne({ userId: user._id })
    if (!userAffinity) {
      throw new Error('User affinities not found')
    }
    // Can only edit affinity value after creation
    const newAffinities = []

    affinities.forEach((topic) => {
      if (!affinitiesTruthTable.includes(topic)) {
        throw new Error(`Invalid topic ID: ${topic}`)
      }
      newAffinities.push(topic);
    })

    userAffinity.affinities = newAffinities

    const savedUserAffinity = await userAffinity.save()
    return savedUserAffinity
  } catch (error) {
    throw new Error(`Update user affinities error: ${error}`)
  }
}

export const deleteUserAffinities = async (user) => {
  try {
    const userAffinity = await UserAffinity.findOne({ userId: user._id })
    if (!userAffinity) {
      throw new Error('User affinities not found')
    }
    await UserAffinity.deleteOne(userAffinity._id)
    return true
  } catch (error) {
    throw new Error(`Delete user affinities error: ${error}`)
  }
}

export const adminGetUserAffinities = async ({ userId }) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error('User not found')
    }
    return getUserAffinities(user);
  } catch (error) {
    throw new Error(`Get user affinities with admin permissions error: ${error}`)
  }
}