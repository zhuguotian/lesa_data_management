import java.io.*;
import java.util.*;

import org.json.JSONObject;
import org.json.JSONArray;

public class CsvUtil{
	private String currentLine;
	private BufferedReader br = null;
	private List<String> list = new ArrayList<String>();

	public CsvUtil(){

	}
	
	//return everything in the file as list
	public CsvUtil(String filename){
		try{
			BufferedReader br = new BufferedReader(new FileReader(filename));
			while ((currentLine = br.readLine()) != null) {
				list.add(currentLine);
			}
			br.close();
		}catch(IOException e){
			e.printStackTrace();
		}
	}
	
	//parse out time
	public List parse_time(List list) {
		List<String> time_list = new ArrayList<String>();
		for(int i=0; i<list.size(); i++) {
			String currentLine = (String) list.get(i);
			for (int j=0; j<currentLine.length(); j++) {
				char ed = currentLine.charAt(j);
				if(ed == ',') {
					//System.out.println(currentLine.substring(j+2, currentLine.length()));
					time_list.add(currentLine.substring(0, j));
					continue;
				}
			}
		}
		return time_list;
	}
	
	//parse out single dist and there coord and combine with time into a JSONObject
	public JSONObject parse_dist(List list, List time_list) {
		JSONObject main = new JSONObject();
		
		//for the given file, each distance data has a length of 4 bytes
		int digits = 4;
		//given a 20 * 25 mtx as raw input
		int row = 20;
		
		for(int i=0; i<list.size(); i++) {
			String currentLine = (String) list.get(i);
			JSONObject dist = new JSONObject();
			int x = 0;
			int y = 1;
			int flag = 0;
			int j = 0;
			while (j<currentLine.length()) {
				char c = currentLine.charAt(j);
				//find where time slot end and where distance data starts
				if(c == '[') {
					flag = 1;
				}
				if(flag == 1 && Character.isDigit(c) == true ) {
					if(x == row) {
						y+=1;
						x=0;
					}
					x+=1;
					String coord = String.valueOf(x)+','+String.valueOf(y);
					Integer number = Integer.valueOf(currentLine.substring(j, j+digits));
					//System.out.println(number);
					j+=digits;
					dist.put(coord, number);
				}
				j++;
			}
			main.put(String.valueOf(time_list.get(i)), dist);
		}
		System.out.print(main);
		return main;
	}
	
	//get row number
    public int getRowNum() {
    	return list.size();
    }
    
    //get col number
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
    
    //access to certain row
    public String getRow(int index) {
        if (this.list.size() != 0) {
                return (String) list.get(index);
        } else {
                return null;
        }
    }
    
    //access to certain column
    public String getCol(int index) {
        if (this.getColNum() == 0) {
                return null;
        }
        StringBuffer sb = new StringBuffer();
        String tmp = null;
        int colnum = this.getColNum();
        if (colnum > 1) {
            for (Iterator it = list.iterator(); it.hasNext();) {
                    tmp = it.next().toString();
                    sb = sb.append(tmp.split(",")[index] + ",");
            }
        } else {
            for (Iterator it = list.iterator(); it.hasNext();) {
                    tmp = it.next().toString();
                    sb = sb.append(tmp + ",");
            }
        }
        String str = new String(sb.toString());
        str = str.substring(0, str.length() - 1);
        return str;
    }
    
    //get to certain unit
    public String getString(int row, int col) {
        String temp = null;
        int colnum = this.getColNum();
        if (colnum > 1) {
                temp = list.get(row).toString().split(",")[col];
        } else if(colnum == 1){
                temp = list.get(row).toString();
        } else {
                temp = null;
        }
        return temp;
    }
    
    //close file
    public void CsvClose()throws Exception{
         this.br.close();
    }
    //accessor
	public List getList(){
		return list;
	}
	
	//get rid of header line
	public String removehead(String str){
		String[] str_1=str.split(",");
		String sb=new String();
		for(int i=1;i<str_1.length;i++){
			sb=sb+str_1[i]+",";
		}
		return sb;
    }
	
	//parse regular JSON format where each column actually corresponding to each value
	public JSONArray readcsv(String path) {
		JSONArray array=new JSONArray();
		try{
			CsvUtil util = new CsvUtil(path);
			int col=util.getColNum();
			
			for(int i=0;i<col;i+=1){
				JSONObject jsonobject=new JSONObject();
				String value=util.getCol(i);
				jsonobject.put(util.getString(0, i),util.removehead(value));
				array.put(jsonobject);
			}
			util.CsvClose();

		}catch(Exception e){
			e.printStackTrace();
		}
	return array;
	}
	
	public static void main(String[] args) {
		JSONArray arr = new JSONArray();
		String filename = "TOF01.csv";
		CsvUtil csv = new CsvUtil(filename);
		List list = csv.getList();
		arr = csv.readcsv(filename);
		
		List<String> time_list = new ArrayList<String>();
		JSONObject dist_list = new JSONObject();
		time_list = csv.parse_time(list);
		dist_list = csv.parse_dist(list, time_list);
	}	
		
}

