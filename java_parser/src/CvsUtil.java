import java.io.*;
import java.util.*;

import org.json.simple.JSONObject;
import org.json.simple.JSONarray;

public class CvsUtil{
	private String currentLine;
	private BufferedReader br = null;
	private String filename = null;
	private List<String> list = new ArrayList<String>();

	public CvsUtil(){

	}

	public void CvsUtil(String filename){
		try{
			BufferedReader br = new BufferedReader(new FileReader(filename));
			while ((currentLine = br.readLine()) != null) {
				list.add(currentLine);
			}
		}catch(IOException e){
			e.printStackTrace();
		}
	}

    public int getRowNum() {
            return list.size();
    }

    public int getColNum() {
            if (!list.toString().equals("[]")) {
                    if (list.get(0).toString().contains(",")) {
                            return list.get(0).toString().split(",").length;
                    } else if (list.get(0).toString().trim().length() != 0) {
                            return 1;
                    } else {
                            return 0;
                    }
            } else {
                    return 0;
            }
    }


	public List getList(){
		return list;
	}

	public static void main(String[] args){
		JSONArray array=new JSONArray();
		String filename = "TOF01.csv";
		try{
			CvsUtil util = new CvsUtil(filename);
			int row=util.getRowNum();
			int col=util.getColNum();
			for(int i=0;i<col;i++){
				JSONObject jsonobject=new JSONObject();
				String value=util.getCol(i);
				jsonobject.put(util.getString(0, i),util.removehead(value));
				array.add(jsonobject);
			}


		}catch(Exception e){
			e.printStackTrace();
		}
		
	}
}







