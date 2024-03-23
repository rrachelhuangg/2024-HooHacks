const company_types = ['Industrials', 'Health Care', 'Information Technology', 'Utilities',
                    'Financials', 'Materials', 'Consumer Discretionary', 'Real Estate',
                    'Communication Services', 'Consumer Staples', 'Energy']

var client_info = new File([""], "resources/client_info.txt")

reader.onload = function(e) {
	var result = reader.result
	print(result)
}

reader.readAsText(new File('someTextFile.txt'));

fs.writeFile('Hello.txt', data, (err) => {
 
    // In case of a error throw err.
    if (err) throw err;
})