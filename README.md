git clone git@github.com:ministryofjustice/oauth2-test.git
cd oauth2-test
yarn


You need to create an .env file with the following:-

    USE_API_GATEWAY_AUTH=yes
    API_ENDPOINT_URL=https://noms-api-dev.dsd.io/elite2api/
    NOMS_TOKEN=******
    NOMS_PRIVATE_KEY="-----BEGIN EC PRIVATE KEY-----\n*********\n-----END EC PRIVATE KEY-----"
    

- Generate the private key

openssl ecparam -name prime256v1 -genkey -noout -out mydevclient.key 
openssl ec -in mydevclient.key -pubout -out mydevclient.pub

Upload to the mydevclient.pub file to this website and choose dev.


You can then start the app with:-

yarn start

And goto http://localhost:3000


You need the API running locally on 8080

      ./gradlew assemble
      java -Dspring.profiles.active=nomis-hsqldb \
        -Doracle.jdbc.J2EE13Compliant=true \
        -Dcom.sun.management.jmxremote.local.only=false \
        -Djava.security.egd=file:/dev/./urandom -jar \
        mobile-web/build/libs/mobile-web-1.0.20.jar


Check out the code to see how it works and also see the https://bitbucket.org/cool_syscon_team/elite2-web for how we do it in the NOTM application
