## OAUTH2 tester and Proxy

### Build
```bash
git clone git@github.com:ministryofjustice/oauth2-test.git
cd oauth2-test
yarn
```

### Configure
You need to create an .env file with the following:-
```properties
USE_API_GATEWAY_AUTH=yes
API_ENDPOINT_URL=https://noms-api-dev.dsd.io/elite2api/
NOMS_TOKEN=******
NOMS_PRIVATE_KEY="-----BEGIN EC PRIVATE KEY-----\n*********\n-----END EC PRIVATE KEY-----"
```    

### Generate the private key

```bash
openssl ecparam -name prime256v1 -genkey -noout -out mydevclient.key 
openssl ec -in mydevclient.key -pubout -out mydevclient.pub
```

Choose Dev and Upload to the **mydevclient.pub** file to this website - https://nomis-api-access.service.justice.gov.uk/.

### Running

You need the API running locally on 8080

```bash
docker run -e SPRING_PROFILES_ACTIVE=nomis-hsqldb sysconjusticesystems/elite2-api:latest
```

You can then start the app with:-

```bash
yarn start
```

And goto [http://localhost:3000](http://localhost:3000)


Check out the code to see how it works and also see the [elite2web](https://bitbucket.org/cool_syscon_team/elite2-web) git repo for how we do it in the NOTM application
