import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import Script from "next/script";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Buddy Script",
  icons: {
    icon: "/logo-copy.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </head>

      <body className={`${poppins.variable}`}>
        {children}
        <Script src="/assets/js/bootstrap.bundle.min.js" />
        <Script src="/assets/js/custom.js" />
        <Script id="show-notifyDropdown">
          {`
  		var notifyDropdown = document.querySelector("#_notify_drop");
		var notifyDropShowBtn = document.querySelector("#_notify_btn");
		var isDropShow1 = false;
		console.log(isDropShow1);

		notifyDropShowBtn.addEventListener("click", function(){
			isDropShow1 = !isDropShow1;
			console.log(isDropShow1)
			if(isDropShow1){
				notifyDropdown.classList.add('show');
				console.log("shown")
			}
			else{
				notifyDropdown.classList.remove('show');
				console.log("hidden")
			}
		})
  `}
        </Script>
      </body>
    </html>
  );
}
