#define PI 3.1415926535897932384626433832795
#define PIOVER2 1.5707963

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float sphereSize = 100.0;
    vec4 startColor = vec4(1.0, 1.0, 1.0, 1.0);
    
    vec3 lightVector = normalize(vec3(sin(mod(iTime * 2.0, PI * 2.0)), 1.0, cos(mod(iTime * 2.0, PI * 2.0))));
    vec3 lightColor = vec3(1.0, 0.5, 1.0);
    float lightIntensity = 1.0;
    vec3 ambient = vec3(0.1, 0.1, 0.1);

    vec2 centerPoint = iResolution.xy / 2.0;
    vec2 relativePos = fragCoord - centerPoint;
    float distFromCenter = length(relativePos);
    bool withinSphere = distFromCenter <= sphereSize;

    if(!withinSphere)
    {
        startColor.xyz = vec3(0.0, 0.0, 0.0);
    }
    else
    {
    	vec3 surfaceNormal = vec3(sin(relativePos.x / sphereSize * PIOVER2),
                                  sin(relativePos.y / sphereSize * PIOVER2),
                                  cos(distFromCenter / sphereSize * PIOVER2));
        //vec3 surfaceColor = vec3(surfaceNormal.xy * 0.5 + 0.5, surfaceNormal.z);
        vec3 surfaceColor = vec3(1.0, 1.0, 1.0);
        //startColor.xyz = normalize(surfaceNormal);
        //startColor.xyz = surfaceNormal;
        
        //Lambertian reflectance
        
        vec3 lambert = max(dot(surfaceNormal, lightVector), 0.0) * lightIntensity * surfaceColor * lightColor;
        startColor.xyz = (ambient * surfaceColor) + lambert * (vec3(1.0,1.0,1.0) - ambient);
        //startColor.xyz = lambert;
    }

    fragColor = startColor;
}