#define PI 3.1415926535897932384626433832795
#define PIOVER2 1.5707963

struct Light
{
    vec3 Direction;
    //Bake intensity into color
    vec3 Color;
};

int lightCount = 2;
vec3 lights[4] = vec3[4](vec3(0.0, 0.0, 0.0), vec3(1.0, 0.5, 1.0), vec3(0.0, 0.0, 0.0), vec3(0.5, 1.0, 0.5));


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    float sphereSize = 100.0;
    vec4 startColor = vec4(1.0, 1.0, 1.0, 1.0);
    
    //vec3 lightVector = normalize(vec3(sin(mod(iTime * 2.0, PI * 2.0)), 1.0, cos(mod(iTime * 2.0, PI * 2.0))));
    //vec3 lightColor = vec3(1.0, 0.5, 1.0);
    //float lightIntensity = 1.0;
    vec3 ambient = vec3(0.1, 0.1, 0.1);


    vec2 centerPoint = iResolution.xy / 2.0;
    vec2 relativePos = fragCoord - centerPoint;
    float distFromCenter = length(relativePos);
    float specular = 0.7;
    float gloss = 3.0;
    bool withinSphere = distFromCenter <= sphereSize;
    
    lights[0] = normalize(vec3(sin(mod(iTime * 2.0, PI * 2.0)), 1.0, cos(mod(iTime * 2.0, PI * 2.0))));
    //lights[2] = normalize(vec3(cos(mod(iTime * 2.0, PI * 2.0)), -1.0, sin(mod(iTime * 2.0, PI * 2.0))));
    lights[2] = normalize(vec3((iMouse.xy - centerPoint) / sphereSize, 0.5));
    
    vec3 eyeVec = vec3(0.0, 0.0, -1.0);
    vec3 halfways[2];
    halfways = vec3[2](normalize(lights[0] + eyeVec), normalize(lights[2] + eyeVec));

    if(!withinSphere)
    {
        startColor.xyz = vec3(0.0, 0.0, 0.0);
    }
    else
    {
    	vec3 surfaceNormal = vec3(sin(relativePos.x / sphereSize * PIOVER2),
                                  sin(relativePos.y / sphereSize * PIOVER2),
                                  cos(distFromCenter / sphereSize * PIOVER2));
        vec3 surfaceColor = vec3(surfaceNormal.xy * 0.5 + 0.5, surfaceNormal.z);
        //vec3 surfaceColor = vec3(1.0, 1.0, 1.0);
        surfaceNormal = normalize(surfaceNormal);
        
        startColor.xyz = (ambient * surfaceColor);
        
        for(int i = 0; i < lightCount; i++)
        {
        	vec3 lambert = max(dot(surfaceNormal, lights[i * 2]), 0.0) * lights[i * 2 + 1] * surfaceColor;            
            vec3 blinnPhong = vec3(1.0, 1.0, 1.0) * specular * max(pow(dot(halfways[i], surfaceNormal), gloss), 0.0);
            startColor.xyz += lambert + blinnPhong;
        }
        //startColor.xyz = (ambient * surfaceColor) + lambert * (vec3(1.0,1.0,1.0) - ambient);
        //startColor.xyz = lambert;
    }

    fragColor = startColor;
}