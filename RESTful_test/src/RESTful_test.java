import java.io.*;
import java.net.URL;
import java.nio.charset.Charset;
import java.util.*;

import org.json.JSONObject;
import org.json.JSONArray;
import org.json.JSONException;

public class RESTful_test {
	public static JSONObject readJsonFromUrl(String url) throws IOException, JSONException {
	    InputStream is = new URL(url).openStream();
	    try {
	      BufferedReader rd = new BufferedReader(new InputStreamReader(is, Charset.forName("UTF-8")));
	      StringBuilder sb = new StringBuilder();
		  int cp;
		  while ((cp = rd.read()) != -1) {
		    sb.append((char) cp);
		  }
	      String jsonText = sb.toString();
	      JSONObject json = new JSONObject(jsonText);  
	      return json;
	    } finally {
	      is.close();
	    }
	}  
	public static void main(String[] args) throws IOException, JSONException {
		String url = "http://data.smartlighting.rpi.edu/hadatac/api/deployments/all";
		JSONObject json = RESTful_test.readJsonFromUrl(url); 
		System.out.println(json.toString());
	}
	
	
}