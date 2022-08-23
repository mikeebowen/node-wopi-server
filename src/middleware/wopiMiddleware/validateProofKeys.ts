// 'use strict'

// const getPem = require('rsa-pem-from-mod-exp')
// const crypto = require('crypto')
// const { getProofKeys } = require('../../utils')

// module.exports = async (req, res, next) => {
//   const { oldmodulus, oldexponent, modulus, exponent } = await getProofKeys()
//   const oldPublicKey = getPem(oldmodulus, oldexponent)
//   const publicKey = getPem(modulus, exponent)
//   const wopiProof = req.header('X-WOPI-Proof')
//   const oldWopiProof = req.header('X-WOPI-ProofOld')

//   const signedWopiProof = Buffer.from(wopiProof, 'base64')
//   const oldSignedWopiProof = Buffer.from(oldWopiProof, 'base64')


//   next()
// }
// // {
// //         url: mydomain + req.originalUrl,
// //         accessToken: req.query.access_token,
// //         timestamp: req.headers['x-wopi-timestamp']  //!String! Too big for JavaScript numeric types
// //     },
// //     {
// //         proof: req.headers['x-wopi-proof'],
// //         proofold: req.headers['x-wopi-proofold']
// //     },
// //     {
// //         modulus: '...',
// //         exponent: '...',
// //         oldmodulus: '...',
// //         oldexponent: '...'
// //     }
// function tryVerification(expectedProof, signedProof, publicKey) {
//   const verifier = crypto.createVerify('RSA-SHA256')
//   verifier.update(signedWopiProof)
//   const ver = verifier.verify(oldPublicKey, oldSignedWopiProof, 'base64')
// }

// function buildExpectedProof(input) {
//   const fullUrl = percentEncode(input.url).toUpperCase() //not sure about the escaping yet.

//   const fullUrlBuffer = Buffer.from(fullUrl, 'utf8')
//   const accessTokenBuffer = Buffer.from(input.accessToken, 'utf8')

//   const timeBuffer = bignum(input.timestamp).toBuffer({
//     endian: 'big',
//     size: 8,
//   })

//   const expectedProofBuffer = Buffer.concat([
//     getLengthIn4Bytes(accessTokenBuffer),
//     accessTokenBuffer,
//     getLengthIn4Bytes(fullUrlBuffer),
//     fullUrlBuffer,
//     getLengthIn4Bytes(timeBuffer),
//     timeBuffer,
//   ])

//   return expectedProofBuffer
// }
