/**
 * JSON Web Key (JWK)
 * 
 * A JSON object that represents a cryptographic key.
 * The members of the object represent properties of the key, including its value.
 */
export interface Jwk {
    /** the algorithm for the key */
    alg: string,
    /** the key type */
    kty: string,
    /** how the key was meant to be used. For the example above, sig represents signature verification */
    use: string,
    /** the moduluos for a standard pem */
    n: string,
    /** the exponent for a standard pem */
    e: string,
    /** the unique identifier for the key */
    kid: string,
    /** the thumbprint of the x.509 cert (SHA-1 thumbprint) */
    x5t: string,
    /** the x509 certificate chain */ 
    x5c: string[]
}